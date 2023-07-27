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
    let insertId = null;
    if (!contactExists.length > 0 && body.email && body.phoneNumber) {
      console.log("Inside null check");
      let secondPrimaryId = existingContacts.find((item, index) => index > 0 && item.linkPrecedence === 'primary')?.id;
      console.log("insert contact", secondPrimaryId);
      if (secondPrimaryId) {
        console.log("Second contact is primary 100");
        await sqlConnection.query(
          "UPDATE Contact SET linkPrecedence = 'secondary', linkedId = ? where id = ?;",
          [existingContacts[0].id,secondPrimaryId]
        );
      } else {
          insertId = await insertContact(
          body.phoneNumber,
          body.email,
          existingContacts[0].linkPrecedence === "primary"
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
    existingContacts.push({
      id: insertId,
      email: body.email,
      phoneNumber: body.phoneNumber !== null ? body.phoneNumber.toString() : null,
      linkPrecedence: "secondary"
    })
    console.log("Contacts",existingContacts);
    let { emails, phoneNumbers, secondaryContactIds } =
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
    if (item.email !== null) uniqueEmails.add(item.email);
    if (item.phoneNumber !== null) uniquePhoneNumbers.add(item.phoneNumber);
  });
  const secondaryIds = data
    .filter((item) => item.linkPrecedence === "secondary" && item.id !== null)
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
