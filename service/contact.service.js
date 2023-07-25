const sqlConnection = require("../database");

module.exports.getAllContacts = async () => {
  const [data] = await sqlConnection.query("SELECT * FROM Contact");
  return data;
};

module.exports.getContactById = async (id) => {
  const [data] = await sqlConnection.query(
    "SELECT * FROM Contact WHERE id = ?",
    [id]
  );
  return data;
};

module.exports.addContact = async (body) => {
  let [existingContacts] = await sqlConnection.query(
    "SELECT * FROM Contact WHERE phoneNumber = ? OR email = ? ORDER BY createdAt ASC",
    [body.phoneNumber, body.email]
  );
  let [contactExists] = await sqlConnection.query(
    "SELECT * FROM Contact WHERE phoneNumber = ? AND email = ? ORDER BY createdAt ASC",
    [body.phoneNumber, body.email]
  );
  if (existingContacts.length) {
    if (!contactExists.length > 0 && body.email && body.phoneNumber) {
      if (existingContacts[1].linkPrecedence === "primary") {
        await sqlConnection.query(
          "UPDATE Contact SET linkPrecedence = 'secondary' where id = ?;",
          [existingContacts[1].id]
        );
      } else {
        insertContact(
          body.phoneNumber,
          body.email,
          existingContacts[0].linkPrecedence == "primary"
            ? existingContacts[0].id
            : existingContacts[0].linkedId,
          "secondary"
        );
      }
    }

    if (existingContacts[0].linkPrecedence === "secondary") {
      [existingContacts] = await sqlConnection.query(
        "SELECT * FROM Contact WHERE id = ? OR linkedId = ? ORDER BY createdAt ASC ",
        [existingContacts[0].linkedId, existingContacts[0].linkedId]
      );
    } else if (!body.email || !body.phoneNumber) {
      [existingContacts] = await sqlConnection.query(
        "SELECT * FROM Contact WHERE phoneNumber = ? OR email = ? ORDER BY createdAt ASC ",
        [existingContacts[0].phoneNumber, existingContacts[0].email]
      );
    }

    const { emails, phoneNumbers, secondaryContactIds } =
      extractUniqueValues(existingContacts);

    return {
      contact: {
        primaryContactId: existingContacts[0].id || null,
        emails: emails,
        phoneNumbers: phoneNumbers,
        secondaryContactIds: secondaryContactIds,
      },
    };
  } else {
    let insertId = await insertContact(
      body.phoneNumber,
      body.email,
      null,
      "primary"
    );

    return {
      contact: {
        primaryContactId: insertId || null,
        emails: [body.email],
        phoneNumbers: [body.phoneNumber],
        secondaryContactIds: [],
      },
    };
  }
};

function extractUniqueValues(data) {
  const uniqueEmails = new Set();
  const uniquePhoneNumbers = new Set();

  data.forEach((item) => {
    uniqueEmails.add(item.email);
    uniquePhoneNumbers.add(item.phoneNumber);
  });
  const secondaryIds = data
    .filter((item) => item.linkPrecedence === "secondary")
    .map((item) => item.id);

  return {
    emails: Array.from(uniqueEmails),
    phoneNumbers: Array.from(uniquePhoneNumbers),
    secondaryContactIds: secondaryIds,
  };
}

async function insertContact(phoneNumber, email, linkedId, linkPrecedence) {
  const time = new Date();
  const data = await sqlConnection.query(
    "INSERT INTO Contact (phoneNumber, email,linkedId,linkPrecedence, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
    [phoneNumber, email, linkedId, linkPrecedence, time, time]
  );
  return data[0]?.insertId;
}
