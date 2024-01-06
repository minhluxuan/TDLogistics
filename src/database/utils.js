const findOne = async (pool, table, fields, values) => {
  const query = `SELECT * FROM ${table} WHERE ${fields.map((field) => `${field} = ?`)} LIMIT 1`;

  try {
    const result = await pool.query(query, values);
    console.log("Success!");
    return result[0];
  } catch (error) {
    console.log("Error: ", error);
    throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
  }
};

const find = async (pool, table, fields = null, values = null) => {
  let query;

  if (fields !== null && values !== null) {
    query = `SELECT * FROM ${table} WHERE ${fields.map((field) => `${field} = ?`)}`;
  } else {
    query = `SELECT * FROM ${table}`;
  }

  try {
    const result = await pool.query(query, values);
    console.log("Success!");
    return result[0];
  } catch (error) {
    console.log("Error: ", error);
    throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
  }
};

const insert = async (pool, table, fields, values) => {
  const query = `INSERT INTO ${table} (${fields.map((field) => `${field}`)}) VALUES (${fields.map((field) => `?`)})`;

  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.log("Error: ", error);
    throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
  }
};

const update = async (pool, table, fields, values, conditionFields, conditionValues) => {
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const whereClause = conditionFields.map((conditionField) => `${conditionField} = ?`).join(" AND ");

  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

  try {
    const result = await pool.query(query, [...values, ...conditionValues]);
    return result;
  } catch (error) {
    console.log("Error: ", error);
    throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
  }
};

const getLastRow = async (pool, table) => {
  const query = `SELECT * FROM ?? ORDER BY id DESC LIMIT 1`;

  try {
    const result = await pool.query(query, [table]);

    if (result.length > 0) {
      return result[0][0];
    }

    return null;
  } catch (error) {
    console.log("Error: ", error);
    throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
  }
};

/*
In the database, the journey has the form of a json:
{
    value: [
    {
        status: "string1",
        date: datetime1,
    },
    {
        status: "string2",
        date: datetime2,
    },
}
*/
// const append = async (pool, table, fields, values, conditionFields, conditionValues) => {
//   const query = `UPDATE ?? SET ?? = JSON_ARRAY_APPEND(journey, '$.value', JSON_OBJECT('time', ?, 'location', ?)) WHERE ?? = ?`;

//   try {
//     const result = await pool.query(query, [
//       table,
//       fields,
//       values.time,
//       values.location,
//       conditionFields,
//       conditionValues,
//     ]);
//     return result;
//   } catch (err) {
//     console.log(err);
//     throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
//   }
// };
const append = async (pool, table, fields, arrayName, newValues, conditionFields, conditionValues) => {
  const keyValuePairs = Object.entries(newValues).flat();
  const placeholders = new Array(keyValuePairs.length).fill("?").join(", ");
  const query = `UPDATE ?? SET ?? = JSON_ARRAY_APPEND(??, '$.${arrayName}', JSON_OBJECT(${placeholders})) WHERE ?? = ?`;

  try {
    const result = await pool.query(query, [table, fields, fields, ...keyValuePairs, conditionFields, conditionValues]);
    return result;
  } catch (err) {
    console.log(err);
    throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
  }
};
// const append = async (pool, table, fields, arrayName, newValues, conditionFields, conditionValues) => {
//   const keyValuePairs = Object.entries(newValues).flat();
//   const placeholders = new Array(keyValuePairs.length).fill("?").join(", ");
//   const query = `UPDATE ?? SET ?? = JSON_ARRAY_APPEND(??, '$.value', JSON_OBJECT(${placeholders})) WHERE ?? = ?`;

//   try {
//     const result = await pool.query(query, [table, fields, fields, ...keyValuePairs, conditionFields, conditionValues]);
//     return result;
//   } catch (err) {
//     console.log(err);
//     throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
//   }
// };
// const getJourney = async (pool, table, conditionField, conditionValues) => {
//   const query = `SELECT * FROM ? WHERE ? = ? LIMIT 1`;
//   try {
//     const result = await pool.query(query, [table, conditionField, conditionValues]);
//     if (result.length > 0) {
//       return result[0][0];
//     }
//     return null;
//   } catch (err) {
//     console.log(err);
//     throw "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!";
//   }
// };

module.exports = {
  findOne,
  find,
  insert,
  update,
  getLastRow,
  append,
};
