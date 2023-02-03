import { Router, Response } from "express";
import moment from "moment";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import Vacancy , { IVacancy, TVacancy} from "../../models/Vacancy";
import auth from "../../middleware/auth";
import User, {IUser} from "../../models/User";

const router: Router = Router();

// @route   POST api/vacancy
// @desc    create Vacancy given their name ,email and description
// @access  Public

router.post(
  "/create",
  [
    check("position", "position is required").exists(),
    check("years_of_experience", "years of experience is required").isNumeric(),
    check("status", "status should be either open or close ").isIn(['open','close']),
    check("description", "description is required").exists(),
  ], auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { position,years_of_experience,status, description } = req.body;
    try {

      // Build Vacancy object based on TVacancy
      const vacancyFields: TVacancy = {
        position,
        years_of_experience,
        status,
        description,
      };

      let vacancy:IVacancy = new Vacancy(vacancyFields);

      await vacancy.save();
      res.json({ "msg": "vacancy successfully created"});
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  });
// @route   get api/vacancy/list
// @desc    create Vacancy given their name ,email and description
// @access  Public

router.get(
  "/list",auth,
   async (req: Request, res: Response) => {
    try {
      let data: IVacancy[]
      if(req.query.years){
        data = await Vacancy.find({years_of_experience:req.query.years,status:'open'});
      }
      else{
        data = await Vacancy.find();
      }
      res.json({data});
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);


// @route   POST api/vacancy
// @desc    apply for  Vacancy given vacancy_id
// @access  Public

router.post(
    "/apply",
    [
      check("vacancy_id", "vacancy id is required").exists(),
    ], auth, async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
            .status(HttpStatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() });
      }

      const { vacancy_id } = req.body;
      try {

        let vacancy:IVacancy =await Vacancy.findById(vacancy_id)

        if (!vacancy) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            errors: [
              {
                msg: "can't find vacancy",
              },
            ],
          });
        }

        let user:IUser =await User.findOne({id:req.userId})

        if(user){
          let isAppliedBefore = user.vacancies.find((row)=>row.id ==vacancy_id)
          if(isAppliedBefore){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              errors: [
                {
                  msg: "User already apply to this vacancy",
                },
              ],
            });
          }

          //check how many vacancies that user apply this day
           let count = 0
           user.vacancies.map((row)=>{
              if( moment().isSame(row.date,'day')){
                count+=1
              }
            })


          if(count>=3){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              errors: [
                {
                  msg: "Candidates cannot apply for more than three jobs per day.",
                },
              ],
            });
          }
          // Update
          user = await User.findOneAndUpdate(
              { user: req.userId },
              {"$push": { vacancies:{"id": vacancy_id }} },
              { new: true }
          );
          return res.json(user);
        }
      } catch (err) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      }
    });

export default router;
