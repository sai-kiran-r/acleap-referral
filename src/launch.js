import FHIR from 'fhirclient'

const meldAcLeapEhrScope = "launch launch/patient openid fhirUser patient/Patient.read patient/Practitioner.read patient/RelatedPerson.read patient/Condition.read patient/DiagnosticReport.read patient/Observation.read patient/Procedure.read patient/CarePlan.read patient/CareTeam.read patient/Goal.read patient/Immunization.read patient/MedicationRequest.read patient/ServiceRequest.read patient/Task.read patient/Questionnaire.read patient/QuestionnaireResponse.write patient/Goal.write patient/MedicationRequest.write patient/Condition.write"

FHIR.oauth2.authorize([
    {
        // Meld acleap EHR test data sandbox
        issMatch: /\bgw.interop.community\/acleapehr\b/i,
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_meld_acleap_ehr,
        scope: meldAcLeapEhrScope
    },
])
