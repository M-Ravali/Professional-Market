const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../User"); // Adjust path as needed

describe("User Model", () => {
  // Connect to a new in-memory database before running any tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Clear all test data after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Password Encryption", () => {
    it("should hash the password before saving", async () => {
      const user = new User({
        name: "Test User",
        email: "testuser@example.com",
        password: "plaintextpassword",
        userType: "client",
      });

      await user.save();
      const savedUser = await User.findOne({ email: "testuser@example.com" });

      expect(savedUser.password).not.toBe("plaintextpassword"); // Password should be hashed
      expect(await bcrypt.compare("plaintextpassword", savedUser.password)).toBe(true); // Hashed password should match
    });
  });

  describe("Password Matching", () => {
    it("should return true for correct password", async () => {
      const user = new User({
        name: "Test User",
        email: "testuser@example.com",
        password: "plaintextpassword",
        userType: "client",
      });

      await user.save();

      const isMatch = await user.matchPassword("plaintextpassword");
      expect(isMatch).toBe(true); // Correct password
    });

    it("should return false for incorrect password", async () => {
      const user = new User({
        name: "Test User",
        email: "testuser@example.com",
        password: "plaintextpassword",
        userType: "client",
      });

      await user.save();

      const isMatch = await user.matchPassword("wrongpassword");
      expect(isMatch).toBe(false); // Incorrect password
    });
  });

  describe("Find Professionals with Filters", () => {
    beforeEach(async () => {
      await User.create([
        {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          userType: "professional",
          profession: "developer",
          location: "New York",
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          password: "password123",
          userType: "professional",
          profession: "designer",
          location: "San Francisco",
        },
        {
          name: "Tom Brown",
          email: "tom@example.com",
          password: "password123",
          userType: "client",
          location: "New York",
        },
      ]);
    });

    it("should find professionals only", async () => {
      const professionals = await User.findProfessionals({});
      expect(professionals.length).toBe(2); // Only John and Jane
      professionals.forEach((pro) => expect(pro.userType).toBe("professional"));
    });

    it("should filter by location", async () => {
      const professionals = await User.findProfessionals({ location: "New York" });
      expect(professionals.length).toBe(1);
      expect(professionals[0].name).toBe("John Doe");
    });

    it("should filter by profession", async () => {
      const professionals = await User.findProfessionals({ profession: "designer" });
      expect(professionals.length).toBe(1);
      expect(professionals[0].name).toBe("Jane Smith");
    });

    it("should filter by location and profession", async () => {
      const professionals = await User.findProfessionals({
        location: "San Francisco",
        profession: "designer",
      });
      expect(professionals.length).toBe(1);
      expect(professionals[0].name).toBe("Jane Smith");
    });

    it("should return empty array if no match", async () => {
      const professionals = await User.findProfessionals({
        location: "Los Angeles",
      });
      expect(professionals.length).toBe(0); // No professional in Los Angeles
    });
  });
});
