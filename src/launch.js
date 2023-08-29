import FHIR from 'fhirclient'

const meldAcLeapSchScope = "launch launch/patient openid fhirUser patient/Patient.read patient/Practitioner.read patient/RelatedPerson.read patient/Condition.read patient/DiagnosticReport.read patient/Observation.read patient/Procedure.read patient/CarePlan.read patient/CareTeam.read patient/Goal.read patient/Immunization.read patient/MedicationRequest.read patient/ServiceRequest.read patient/Task.read patient/Questionnaire.read patient/QuestionnaireResponse.write patient/Goal.write patient/MedicationRequest.write patient/Condition.write"

FHIR.oauth2.authorize([
    {
        // Meld acleap Social Care Hub test data sandbox
        issMatch: /\bgw.interop.community\/acleaphub\b/i,
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_meld_acleap_sch,
        scope: meldAcLeapSchScope
    },
])
