import { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2image";
import { AIResponseFormat, prepareInstructions } from "../../constants";

export const meta = () => {
  return [
    { title: "Resumind | Upload" },
    { name: "description", content: "Upload your resume" },
  ];
};
// Generate a UUID v4
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function Upload() {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setIsProcessing(true);
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
    // setStatus("Processing...");
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatus("Uploading...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) {
      // setIsProcessing(false);
      setStatus("Error: Failed to upload file");
      return;
    }
    setStatus("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
      // setIsProcessing(false);
      setStatus("Error: Failed to convert to image");
      return;
    }

    setStatus("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) {
      // setIsProcessing(false);
      setStatus("Error: Failed to upload image");
      return;
    }

    setStatus("Preparing...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    // setIsProcessing(false);
    setStatus("Analyzing...");

    const feedback = await ai.feedback(
      uploadedImage.path,
      prepareInstructions({
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        AIResponseFormat,
      })
    );
    if (!feedback) {
      // setIsProcessing(false);
      setStatus("Error: Failed to analyze");
      return;
    }
    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    // setIsProcessing(false);
    setStatus("Analysis Completed! Redirecting ...");
    // navigate(`/result/${uuid}`);
    console.log(data);
  };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{status}</h2>
              <img src="/images/resume-scan.gif" alt="" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume here for an ATS score and improvement tips</h2>
          )}
        </div>
        {!isProcessing && (
          <form
            className="flex flex-col gap-4 mt-8"
            id="upload-form"
            onSubmit={handleSubmit}
          >
            <div className="form-div">
              <label htmlFor="company-name">Company Name</label>
              <input
                type="text"
                name="company-name"
                id="company-name"
                placeholder="Enter company name"
              />
            </div>
            <div className="form-div">
              <label htmlFor="job-title">Job Title</label>
              <input
                type="text"
                name="job-title"
                id="job-title"
                placeholder="Enter job title"
              />
            </div>
            <div className="form-div">
              <label htmlFor="job-description">Job Description</label>
              <textarea
                rows={5}
                name="job-description"
                id="job-description"
                placeholder="Enter job description"
              />
            </div>
            <div className="form-div">
              <label htmlFor="resume">Upload Resume</label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>
            <button type="submit" className="primary-button">
              Analyze Resume
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
