import FHIR from 'fhirclient'

const meldAcLeapSchScope = "launch launch/patient patient/ServiceRequest.read patient/Task.read patient/Patient.read patient/Task.write fhirUser openid"

FHIR.oauth2.authorize([
    {
        // Meld acleap Social Care Hub test data sandbox
        issMatch: /\bgw.interop.community\/acleaphub\b/i,
        redirectUri: "./index.html",
        clientId: process.env.REACT_APP_CLIENT_ID_meld_acleap_sch,
        scope: meldAcLeapSchScope
    },
])
