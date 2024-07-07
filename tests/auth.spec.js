const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const rootURL = `http://localhost:${PORT}/api`;
const registerURL = rootURL + "/auth/register";
const loginURL = rootURL + "/auth/login";

test("Tests that user is created with a correct default organisation", async () => {
  const userRes = await axios.post(registerURL, {
    firstName: "test",
    lastName: "test",
    email: "test@example.com",
    password: "test",
  });
  // Infer user creation.
  expect(userRes.data.data.accessToken).toBeTruthy();

  const orgRes = await axios.get(rootURL + "/organisations", {
    headers: {
      Authorization: "Bearer " + userRes.data.data.accessToken,
    },
  });
  const organisations = orgRes.data.data.organisations.map((org) => {
    return org.name;
  });
  expect(organisations).toContain("Test's Organisation");
}, 10000);

test("Tests that user creation fails with missing firstName", async () => {
  const res = await axios.post(
    registerURL,
    {
      firstName: null,
      lastName: "test",
      email: "test@example.com",
      password: "test",
    },
    { validateStatus: () => true }
  );
  expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
});

test("Tests that user creation fails with missing lastName", async () => {
  const res = await axios.post(
    registerURL,
    {
      firstName: "test",
      lastName: null,
      email: "test@example.com",
      password: "test",
    },
    { validateStatus: () => true }
  );
  expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
});

test("Tests that user creation fails with missing email", async () => {
  const res = await axios.post(
    registerURL,
    {
      firstName: "test",
      lastName: "test",
      email: null,
      password: "test",
    },
    { validateStatus: () => true }
  );
  expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
});

test("Tests that user creation fails with missing password", async () => {
  const res = await axios.post(
    registerURL,
    {
      firstName: "test",
      lastName: "test",
      email: "test@example.com",
      password: null,
    },
    { validateStatus: () => true }
  );
  expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
});

test("Tests that user creation fails with duplicate emails", async () => {
  await axios.post(
    registerURL,
    {
      firstName: "test",
      lastName: "test",
      email: "test@example.com",
      password: "test",
    },
    { validateStatus: () => true }
  );

  const res = await axios.post(
    registerURL,
    {
      firstName: "test",
      lastName: "test",
      email: "test@example.com",
      password: "test",
    },
    { validateStatus: () => true }
  );

  expect(res.data.message).toBe("Duplicate Creation Attempt");
});

test("Tests that user login returns correct data", async () => {
  await axios.post(registerURL, {
    firstName: "test",
    lastName: "test",
    email: "test1@example.com",
    password: "test",
  });

  const res = await axios.post(loginURL, {
    email: "test1@example.com",
    password: "test",
  });

  expect(res.data.data.accessToken).toBeTruthy();
  expect(res.data.data.user).toBeTruthy();
});
