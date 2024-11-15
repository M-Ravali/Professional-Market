const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const User = require("../../models/User");
const router = require("../professionalRoute"); 

// Mock the User model
jest.mock("../../models/User");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Professionals API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for fetching professionals
  describe("GET /api/professionals", () => {
    it("should return a list of professionals based on filters", async () => {
      User.findProfessionals.mockResolvedValue([{ name: "John Doe", profession: "Engineer" }]);
      const response = await request(app).get("/api/professionals?profession=Engineer");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ name: "John Doe", profession: "Engineer" }]);
    });

    it("should return 404 if no professionals are found", async () => {
      User.findProfessionals.mockResolvedValue([]);
      const response = await request(app).get("/api/professionals?profession=Engineer");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No professionals found");
    });

    it("should return 500 on server error", async () => {
      User.findProfessionals.mockRejectedValue(new Error("Database error"));
      const response = await request(app).get("/api/professionals");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error");
    });
  });

  // Test for submitting a review
  describe("POST /api/professionals/review", () => {
    it("should successfully submit a review", async () => {
      const professional = { ratings: [], save: jest.fn() };
      User.findById.mockResolvedValue(professional);

      const response = await request(app).post("/api/professionals/review").send({
        professionalId: "123",
        userId: "456",
        rating: 5,
        comment: "Great service",
      });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Review submitted successfully");
      expect(professional.ratings).toEqual([{ user: "456", rating: 5, comment: "Great service" }]);
      expect(professional.save).toHaveBeenCalled();
    });

    it("should return 500 on server error during review submission", async () => {
      User.findById.mockRejectedValue(new Error("Database error"));
      const response = await request(app).post("/api/professionals/review").send({
        professionalId: "123",
        userId: "456",
        rating: 5,
        comment: "Great service",
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Error submitting review");
    });
  });

  // Test for updating professional profile
  describe("PUT /api/professionals/update", () => {
    it("should successfully update professional profile", async () => {
      const professional = { save: jest.fn() };
      User.findById.mockResolvedValue(professional);

      const response = await request(app).put("/api/professionals/update").send({
        professionalId: "123",
        certifications: ["Certified Developer"],
        availability: { monday: "9am-5pm" },
      });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Profile updated successfully");
      expect(professional.certifications).toEqual(["Certified Developer"]);
      expect(professional.availability).toEqual({ monday: "9am-5pm" });
      expect(professional.save).toHaveBeenCalled();
    });

    it("should return 500 on server error during profile update", async () => {
      User.findById.mockRejectedValue(new Error("Database error"));
      const response = await request(app).put("/api/professionals/update").send({
        professionalId: "123",
        certifications: ["Certified Developer"],
        availability: { monday: "9am-5pm" },
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Error updating profile");
    });
  });
});
