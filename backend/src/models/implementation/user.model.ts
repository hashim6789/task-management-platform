// import { hashPassword } from "@/utils";
// import { model, Schema, Document } from "mongoose";
// import { IUser } from "shared/types";

// // export interface IUser {
// //   _id: string;
// //   username: string;
// //   name: string;
// //   email: string;
// //   password: string;
// //   status: "active" | "blocked";
// //   role: "user" | "moderator";
// //   bio: string;
// //   profile_picture?: string;
// //   social_links: { type: string; url: string }[];
// //   resume?: string;
// //   date_of_birth: Date;
// //   created_at: Date;
// //   updated_at: Date;
// // }

// export interface IUserModel extends Document, Omit<IUser, "_id"> { }

// const userSchema = new Schema<IUserModel>(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     name: {
//       type: String,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//     },
//     status: {
//       type: String,
//       enum: ["active", "blocked"],
//       default: "active",
//     },
//     role: {
//       type: String,
//       enum: ["user", "moderator"],
//       default: "user",
//     },
//     bio: {
//       type: String,
//       default: '',
//     },
//     profilePicture: {
//       type: String,
//     },
//     socialLinks: [
//       {
//         platform: {
//           type: String,
//         },
//         url: {
//           type: String,
//         },
//       },
//     ],
//     resume: {
//       type: String,
//     },
//     dateOfBirth: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,

//   }
// );

// userSchema.pre<IUserModel>("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await hashPassword(this.password)
//   }
//   next()
// })

// const User = model<IUserModel>("User", userSchema);
// export default User;
