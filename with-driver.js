const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function getTopCountries() {
  await client.connect();
  const result = await client.query(`
    SELECT country, COUNT(*) as count
    FROM survey_responses
    GROUP BY country
    ORDER BY count DESC
    LIMIT 5;
  `);
  console.log(result.rows);
  await client.end();
}

async function getMentalHealthStats() {
  await client.connect();
  const total = await client.query("SELECT COUNT(*) FROM survey_responses");
  const mentalHealth = await client.query(`
    SELECT COUNT(*) as count FROM survey_responses WHERE mental_health_issue = TRUE;
  `);
  const percentage = (mentalHealth.rows[0].count / total.rows[0].count) * 100;
  console.log({
    total: total.rows[0].count,
    mentalHealth: mentalHealth.rows[0].count,
    percentage,
  });
  await client.end();
}