import React from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import Application from "@/models/Application";
import User from "@/models/User"; // Dynamic register
import ApplicantsList from "@/components/employer/ApplicantsList";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getJobApplicantsData(jobId: string, recruiterId: string) {
  try {
    await dbConnect();
    
    // Register candidate User schema
    const _dummyUser = User.schema;

    // 1. Fetch Job detail
    const job = await Job.findById(jobId).lean();
    if (!job) return null;

    // 2. Validate recruiter owns the job posting
    if (job.employerId.toString() !== recruiterId) {
      return null;
    }

    // 3. Fetch applications populated with candidate user
    const appsRaw = await Application.find({ jobId })
      .populate({
        path: "candidateId",
        select: "name email candidateProfile",
      })
      .sort({ createdAt: -1 })
      .lean();

    const applications = JSON.parse(JSON.stringify(appsRaw));

    return {
      jobTitle: job.title,
      applications,
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
