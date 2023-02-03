import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import Company, { ICompany, TCompany} from "../../models/Company";
import c from "config";
import auth from "../../middleware/auth";

const router: Router = Router();

// @route   POST api/company
// @desc    Register company given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/create",
  [
    check("name", "name is required").exists(),
    check("email", "Please include a valid email").isEmail(),
    check("description", "description is required").exists(),
  ],auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { name,email, description } = req.body;
    try {
      let company: ICompany = await Company.findOne({ email });

      if (company) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Company already exists",
            },
          ],
        });
      }


      // Build Company object based on TCompany
      const companyFields: TCompany = {
        name,
        email,
        description,
      };

      company = new Company(companyFields);

      await company.save();
      res.json({ "msg": "Company successfully created"});
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;
