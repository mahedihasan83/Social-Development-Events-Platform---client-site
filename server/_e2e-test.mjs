/**
 * End-to-end test: register → JWT → create event → lists → join.
 * Also verifies the rows really landed in the local MongoDB.
 */
import { MongoClient } from "mongodb";

const BASE = "http://localhost:5000";
const ORIGIN = "http://localhost:3000";
const out = {};
const email = `test_${Date.now()}@example.com`;

// 1. Register (session cookie comes back in set-cookie)
const reg = await fetch(`${BASE}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: ORIGIN },
  body: JSON.stringify({ name: "Rahim Uddin", email, password: "TestPass123" }),
});
out.register = { status: reg.status };
const cookie = (reg.headers.get("set-cookie") ?? "").split(";")[0];

// 2. JWT from /token
const tokRes = await fetch(`${BASE}/api/auth/token`, {
  headers: { cookie, origin: ORIGIN },
});
const tokBody = await tokRes.text();
let jwt = null;
try { jwt = JSON.parse(tokBody)?.token; } catch {}
out.token = { status: tokRes.status, gotJwt: Boolean(jwt) };

// 3. Create event with JWT
const evRes = await fetch(`${BASE}/api/events`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${jwt}`,
    origin: ORIGIN,
  },
  body: JSON.stringify({
    title: "Winter Clothes Distribution",
    description:
      "Distributing warm winter clothes among the needy families of Mirpur area this December.",
    eventType: "Winter Clothes",
    thumbnailUrl: "https://example.com/winter.jpg",
    location: "Mirpur 10, Dhaka",
    date: "2099-01-01",
  }),
});
const evBody = await evRes.text();
let eventId = null;
try { eventId = JSON.parse(evBody)?.event?._id; } catch {}
out.createEvent = { status: evRes.status, eventId };

// 4. Public upcoming list
const upcoming = await fetch(`${BASE}/api/events/upcoming`);
out.upcoming = { status: upcoming.status, count: (JSON.parse(await upcoming.text()).events ?? []).length };

// 5. My-events
const mine = await fetch(`${BASE}/api/events/my-events`, {
  headers: { authorization: `Bearer ${jwt}`, origin: ORIGIN },
});
out.myEvents = { status: mine.status, count: (JSON.parse(await mine.text()).events ?? []).length };

// 6. Join
const joinRes = await fetch(`${BASE}/api/events/${eventId}/join`, {
  method: "POST",
  headers: { authorization: `Bearer ${jwt}`, origin: ORIGIN },
});
out.join = { status: joinRes.status, body: await joinRes.text() };

// 7. Joined list
const joinedRes = await fetch(`${BASE}/api/events/joined`, {
  headers: { authorization: `Bearer ${jwt}`, origin: ORIGIN },
});
out.joined = { status: joinedRes.status, count: (JSON.parse(await joinedRes.text()).events ?? []).length };

// 8. Verify the data really landed in MongoDB
const mc = new MongoClient(
  "mongodb://127.0.0.1:27017/?replicaSet=rs0&directConnection=true"
);
await mc.connect();
const db = mc.db("shohojog");
out.dbCollections = (await db.listCollections().toArray()).map((c) => c.name);
out.dbCounts = {
  users: await db.collection("user").countDocuments(),
  sessions: await db.collection("session").countDocuments(),
  events: await db.collection("events").countDocuments(),
  event_joins: await db.collection("event_joins").countDocuments(),
};
const sampleEvent = await db.collection("events").findOne();
out.dbSampleEvent = sampleEvent && {
  title: sampleEvent.title,
  creatorEmail: sampleEvent.creatorEmail,
  date: sampleEvent.date,
};
await mc.close();

console.log(JSON.stringify(out, null, 2));
process.exit(0);
