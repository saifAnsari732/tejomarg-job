import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import CandidateApplicationsClient from "@/components/candidate/CandidateApplicationsClient";

async function getApplications(userId: string) {
  try {
    const snapshot = await db.collection("applications").where("candidateId", "==", userId).get();
    const apps = await Promise.all(snapshot.docs.map(async (doc) => {
      const appData = doc.data() as any;
      let jobData = null;
      if (appData.jobId) {
        const jobSnap = await db.collection("jobs").doc(appData.jobId).get();
        if (jobSnap.exists) {
           const jData = jobSnap.data() as any;
           let companyData = null;
           if (jData.companyId) {
              const compSnap = await db.collection("companies").doc(jData.companyId).get();
              if (compSnap.exists) {
                 companyData = { _id: compSnap.id, ...compSnap.data() };
              }
           }
           jobData = { _id: jobSnap.id, ...jData, companyId: companyData || jData.companyId };
        }
      }
      return { _id: doc.id, ...appData, jobId: jobData || appData.jobId };
    }));
    
    apps.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return JSON.parse(JSON.stringify(apps));
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export default async function CandidateDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const applications = await getApplications(user?.id);

  return (
    <div className="h-full w-full">
      <CandidateApplicationsClient applications={applications} />
    </div>
  );
}

export const dynamic = "force-dynamic";
