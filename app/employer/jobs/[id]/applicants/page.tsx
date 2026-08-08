import React from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebaseAdmin";
import ApplicantsList from "@/components/employer/ApplicantsList";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getJobApplicantsData(jobId: string, recruiterId: string) {
  try {
    const jobSnap = await db.collection("jobs").doc(jobId).get();
    if (!jobSnap.exists) return null;
    const job = jobSnap.data();

    // 2. Validate recruiter owns the job posting
    if (job?.employerId !== recruiterId) {
      return null;
    }

    // 3. Fetch applications populated with candidate user
    const appsSnap = await db.collection("applications").where("jobId", "==", jobId).get();
    let applications = await Promise.all(appsSnap.docs.map(async (doc) => {
      const data = doc.data();
      let candidate = null;
      if (data.candidateId) {
        const candSnap = await db.collection("users").doc(data.candidateId).get();
        if (candSnap.exists) {
           const cData = candSnap.data() as any;
           candidate = { _id: candSnap.id, name: cData?.name, email: cData?.email, candidateProfile: cData?.candidateProfile };
        }
      }
      return { _id: doc.id, ...data, candidateId: candidate || data.candidateId };
    }));
    
    applications.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return {
      jobTitle: job?.title,
      applications: JSON.parse(JSON.stringify(applications)),
    };
  } catch (error) {
    console.error("Error loading job applicants details:", error);
    return null;
  }
}

export default async function JobApplicantsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const data = await getJobApplicantsData(id, user?.id);

  if (!data) {
    notFound();
  }

  return (
    <ApplicantsList
      initialApplications={data.applications}
      jobTitle={data.jobTitle}
    />
  );
}
export const dynamic = "force-dynamic";
