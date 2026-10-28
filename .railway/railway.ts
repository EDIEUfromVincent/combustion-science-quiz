import { defineRailway, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "web";
export default defineRailway(() => {
  const web = service("web", {
    build: { buildCommand: "npm run build", buildEnvironment: "V3", builder: "RAILPACK" },
    start: "npm start",
    healthcheck: "/api/health",
    healthcheckTimeout: 120,
    replicas: { "europe-west4-drams3a": 1 },
  });

  return project("combustion-science-quiz", {
    variables: { managed: false },
    resources: [web],
  });
});
