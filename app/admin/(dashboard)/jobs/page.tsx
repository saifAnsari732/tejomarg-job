import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import PendingJobsList from "@/components/admin/PendingJobsList";

async function getPendingJobs() {
  try {
    const snapshot = await db.collection("jobs").where("status", "==", "pending").get();
    
    let jobs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let companyData = null;
        if (data.companyId) {
          const compSnap = await db.collection("companies").doc(data.companyId).get();
          if (compSnap.exists) {
            const cData = compSnap.data() as any;
            companyData = {
              _id: compSnap.id,
              name: cData.name,
              logo: cData.logo,
              industry: cData.industry
            };
          }
        }
        return {
          _id: doc.id,
          ...data,
          companyId: companyData || data.companyId
        };
      })
    );

    jobs.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Error loading pending jobs:", error);
    return [];
  }
}

export default async function AdminModerateJobsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const pendingJobs = await getPendingJobs();

  return <PendingJobsList initialJobs={pendingJobs} />;
}
export const dynamic = "force-dynamic";
