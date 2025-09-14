import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const OPENCTI_URL = process.env.OPENCTI_URL;
const OPENCTI_API_KEY = process.env.OPENCTI_API_KEY;

const fetchOpenCTIData = async () => {
  if (!OPENCTI_URL || !OPENCTI_API_KEY) {
    console.warn('OPENCTI_URL or OPENCTI_API_KEY not set - returning empty dataset');
    return [];
  }

  const query = `
    query {
      reports(first: 5) {
        edges {
          node {
            id
            name
            description
            created
          }
        }
      }
    }
  `;

  const res = await fetch(`${OPENCTI_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENCTI_API_KEY}`
    },
    body: JSON.stringify({ query })
  });

  if (!res.ok) throw new Error(`OpenCTI API error ${res.status}`);

  const json = await res.json();
  return (json && json.data && json.data.reports && json.data.reports.edges)
    ? json.data.reports.edges.map(e => e.node)
    : [];
};

export { fetchOpenCTIData };
