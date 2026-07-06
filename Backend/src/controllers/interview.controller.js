const pdfParse = require("pdf-parse")
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume pdf and job description
 */

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

/**
 * @description controller to get interview report by interviewId
 */
async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})
    
    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

/**
 * @description controller to get all interview reports of the logged in user
 */

async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message : "Interview reports fetched successfully",
        interviewReports
    })
}

/**
 * @description controller to generate resume pdf based on user self description, resume and job description
 */
async function generateResumePdfController(req, res){
    const {interviewReportId} = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    const {resume, jobDescription, selfDescription} = interviewReport
    const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription})

    res.set({
        "content-type": "application/pdf",
        "content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}