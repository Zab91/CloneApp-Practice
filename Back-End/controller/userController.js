const db = require("../models");
const bcrypt = require("bcrypt"); //hashing password AKA disamarkan
const user = db.User;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken"); //buat bikin token
const handlebars = require("handlebars"); //buat styling email yang dikirim oleh admin
const fs = require("fs");
const transporter = require("../helper/nodemail");

module.exports = {
  register: async (req, res) => {
    try {
      // console.log(req.body);
      const { username, email, phoneNumber, password, confirmPassword } =
        req.body;
      if (password !== confirmPassword)
        throw "Password anda tidak sama dengan confirm password";
      if (password.length < 8) throw "Password anda kurang dari 8 karakter";

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      const data = await user.create({
        username,
        email,
        phoneNumber,
        password: hashPass,
      });

      const token = jwt.sign({ id: data.id }, "latihanModule4", {
        expiresIn: "3h",
      });

      const tempEmail = fs.readFileSync("./adminEmail/email.html", "utf-8");
      const tempCompile = await handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        username,
        link: `http://localhost:3000/verify/${token}`,
      });

      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Verification User",
        html: tempResult,
      });

      res.status(200).send("Register telah berhasil!");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  verification: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, "latihanModule4");
      console.log(verify);

      await user.update(
        {
          verifyEmail: true,
        },
        {
          where: {
            id: verify.id,
          },
        }
      );
      res.status(200).send("Verifikasi Sukses!");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  login: async (req, res) => {
    try {
      // console.log(req.body)
      const { data, password } = req.body;

      const isUserExist = await user.findOne({
        where: {
          [Op.or]: {
            email: data ? data : "",
            username: data ? data : "",
            phoneNumber: data ? data : "",
          },
        },
        raw: true,
      });
      console.log(isUserExist);

      if (isUserExist.loginAttempt >= 3) {
        await user.update(
          {
            isSuspend: true,
          },
          {
            where: {
              id: isUserExist.id,
            },
          }
        );
        throw `Terlalu banyak Login`;
      } else {
        await user.update(
          {
            loginAttempt: 0,
          },
          {
            where: {
              id: isUserExist.id,
            },
          }
        );
      }

      if (!isUserExist) throw "User tidak ada";
      const isValid = await bcrypt.compare(password, isUserExist.password);

      if (!isValid) {
        await user.update(
          {
            loginAttempt: isUserExist.loginAttempt + 1,
          },
          {
            where: {
              id: isUserExist.id,
            },
          }
        );
        throw `Password yang diketik salah ${isUserExist.loginAttempt + 1} x`;
      }

      const token = jwt.sign(
        {
          username: isUserExist.username,
          id: isUserExist.id,
        },
        "latihanModule4"
      );

      res.status(200).send({
        user: {
          username: isUserExist.username,
          id: isUserExist.id,
        },
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  keepLogin: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, "latihanModule4");
      // console.log(verify)
      const result = await user.findAll({
        where: {
          id: verify.id,
        },
      });
      res.status(200).send({
        id: result[0].id,
        username: result[0].username,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};
