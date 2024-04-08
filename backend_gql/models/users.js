import { Schema, model } from 'mongoose';

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

const userSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      validate: {
          validator: function(v) {
              return emailPattern.test(v);
          },
          message: props => `${props.value} is not a valid email address!`
      }
    },
    password: {
      type: String,
      required: true
    }
})

export default model("User", userSchema);