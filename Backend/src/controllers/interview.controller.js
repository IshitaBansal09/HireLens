const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res){

    const {selfDescription, jobDescription} = req.body

    req.log.info({ userId: req.user.id }, "Interview report generation requested")

    if (!req.file) {
        req.log.warn("Interview report failed: resume file missing")
        return res.status(400).json({ message: "Resume file is required" })
    }
    if (!jobDescription) {
        req.log.warn("Interview report failed: job description missing")
        return res.status(400).json({ message: "Job description is required" })
    }

    req.log.info({ fileSize: req.file.size, mimeType: req.file.mimetype }, "Parsing resume PDF")
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    req.log.info({ resumeLength: resumeContent.text.length }, "Resume PDF parsed")

    req.log.info("Requesting interview report from AI service")
    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })
    req.log.info({ matchScore: interviewReportByAi.matchScore }, "AI interview report received")

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    req.log.info({ reportId: interviewReport._id, userId: req.user.id }, "Interview report generated successfully")

    res.status(201).json({
        message: "Interview Report generated successfully",
        interviewReport
    })
}

module.exports = {generateInterviewReportController}