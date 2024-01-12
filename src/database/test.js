const { getComplaint } = require("./Complaints");

describe("getComplaint", () => {
  test("should return complaint with given id", async () => {
    const fields = ["id"];
    const values = [1];
    const complaint = await getComplaint(fields, values);
    expect(complaint).toBeDefined();
    expect(complaint.id).toBe(1);
  });

  test("should return complaint with given phone_number", async () => {
    const fields = ["phone_number"];
    const values = ["1234567890"];
    const complaint = await getComplaint(fields, values);
    expect(complaint).toBeDefined();
    expect(complaint.phone_number).toBe("1234567890");
  });

  test("should return null if no complaint matches the criteria", async () => {
    const fields = ["id"];
    const values = [9999];
    const complaint = await getComplaint(fields, values);
    expect(complaint).toBeNull();
  });
});
