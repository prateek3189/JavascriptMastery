import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { resumes } from "../../constants/index";
import ResumeCard from "../components/ResumeCard";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Application & Resume Ratings </h1>
          <h2>Review your submissions and check AI Powered Feedback.</h2>
        </div>
        {resumes.length > 0 ? (
          <div className="resumes-section">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="resumes-section">
            <h1>No resumes found</h1>
          </div>
        )}
      </section>
    </main>
  );
}
