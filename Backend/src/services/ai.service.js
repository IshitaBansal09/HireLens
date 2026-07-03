const {GoogleGenAI} = require("@google/genai")
const {z} = require("zod")

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
    })).describe("The preparation plan for the candidate, with day-wise focus areas and tasks to be done.")
})

async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `Generate an interview report for a candidate based on the following information:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                    `      

    const response = await ai.models.generateContent({
        model : "gemini-3-flash-preview",
        contents : prompt,
        config : {
            responseMimeType : "application/json",
            responseSchema : z.toJSONSchema(interviewReportSchema)
        }
    })

    return JSON.parse(response.text) 

}

module.exports = generateInterviewReport