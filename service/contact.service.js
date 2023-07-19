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
  console.log("contactExists:",contactExists.length>0);
  if (existingContacts.length) {
    if(!contactExists.length>0){
      insertContact(body.phoneNumber,body.email,existingContacts[0].id,"secondory");
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
    console.log("Exists", existingContacts);

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
    
    
  }
  return {
    contact: {
      primaryContactId: existingContacts[0]?.id || null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    },
  };
};

function extractUniqueValues(data) {
  const uniqueEmails = new Set();
  const uniquePhoneNumbers = new Set();

  data.forEach((item) => {
    uniqueEmails.add(item.email);
    uniquePhoneNumbers.add(item.phoneNumber);
  });
  const secondaryContactIds = data.flatMap((item) =>
    item.linkPrecedence === "secondary" ? item.id : []
  );

  return {
    emails: Array.from(uniqueEmails),
    phoneNumbers: Array.from(uniquePhoneNumbers),
    secondaryContactIds: secondaryContactIds,
  };
}

async function insertContact (phoneNumber,email,linkedId,linkPrecedence) {
  const time = new Date();
      const data = await sqlConnection.query(
        "INSERT INTO Contact (phoneNumber, email,linkedId,linkPrecedence, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
        [phoneNumber,email, linkedId,linkPrecedence, time, time]
      );
      console.log("Insert data :",data);

}
