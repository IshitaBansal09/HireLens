const {GoogleGenAI} = require("@google/genai")
const {z} = require("zod")
const logger = require("../config/logger")
const puppeteer = require("puppeteer")

// dedicated child logger so all AI-related lines are tagged with a "module" field
const log = logger.child({ module: "ai.service" })

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score between the candidate's resume and the job description, on a scale of 0 to 100"),
    technicalQuestions: z.array(z.object({
            question: z.string().describe("The technical question can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking this question"),
            answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
        })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them."),
    behavioralQuestions: z.array(z.object({
            question: z.string().describe("The technical question can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking this question"),
            answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
        })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking and needs to improve upon"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, whether it is low, medium or high")
    })).describe("The skill gaps that the candidate has and needs to improve upon, along with their severity."),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan, starting from 1"),
        focus: z.string().describe("The focus area for that day, what to focus on and what to improve upon"),
        tasks: z.array(z.string()).describe("The tasks to be done on that day, what to do and how to do it")
    })).describe("The preparation plan for the candidate, with day-wise focus areas and tasks to be done."),
    title: z.string().describe("The title of the job for which the interview report is generated")
})

async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `Generate an interview report for a candidate based on the following information:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                    `

    const model = "gemini-2.5-flash"
    log.info({ model, promptLength: prompt.length }, "Calling generative AI model")

    const startTime = process.hrtime.bigint()
    let response
    try {
        response = await ai.models.generateContent({
            model,
            contents : prompt,
            config : {
                responseMimeType : "application/json",
                responseSchema : z.toJSONSchema(interviewReportSchema)
            }
        })
    } catch (err) {
        log.error({ err, model }, "Generative AI request failed")
        throw err
    }

    const durationMs = Math.round(Number(process.hrtime.bigint() - startTime) / 1e6)
    log.info({ model, durationMs }, "Generative AI response received")

    try {
        return JSON.parse(response.text)
    } catch (err) {
        // the model returned something that is not valid JSON => log a snippet to help debug
        log.error({ err, responseSnippet: (response.text || "").slice(0, 500) }, "Failed to parse AI response as JSON")
        throw err
    }

}

async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({resume, selfDescription, jobDescription}){

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a resume in HTML format for a candidate based on the following information:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a valid JSON object with a single key "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer
                    `
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents : prompt,
        config : {
            responseMimeType : "application/json",
            responseSchema : z.toJSONSchema(resumePdfSchema)
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = {generateInterviewReport, generateResumePdf}