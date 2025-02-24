import { Button } from "../../../../components/ui/button";
import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useCreateStudentMutation } from "../../../../app/api/studentsApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useGetAllClassesQuery } from "../../../../app/api/classApi";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import statesWithLgas from "src/pages/admin/Pages/statesWithLgas"; // Import states and LGAs data

const AddStudent = () => {
  const navigate = useNavigate();
  const { data: classes, isLoading: isClassLoading } = useGetAllClassesQuery();
  const [createStudent, { isLoading, isSuccess, error }] =
    useCreateStudentMutation();
  const [lgas, setLgas] = useState([]);

  const [studentDetails, setStudentDetails] = useState({
    firstName: "",
    middleName: "",
    otherNames: "",
    classId: "",
    parentsNumber: "",
    gender: "",
    stateOfOrigin: "",
    lgaOfOrigin: "",
    parentsAddress: "",
    medicalReport: null,
    birthCertificate: null,
    picture: null,
    password: "",
    dateOfBirth: new Date(),
    age: "",
  });

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "An error occurred");
    }

    if (isSuccess) {
      toast.success("Student Created Successfully");
      navigate("/admin/students");
    }
  }, [isSuccess, error, navigate]);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setStudentDetails((prev) => ({
      ...prev,
      stateOfOrigin: selectedState,
      lgaOfOrigin: "",
    }));
    setLgas(statesWithLgas[selectedState] || []);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setStudentDetails((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "firstName",
      "classId",
      "parentsNumber",
      "gender",
      "stateOfOrigin",
      "lgaOfOrigin",
      "parentsAddress",
      "password",
      "dateOfBirth",
    ];
    const missingFields = requiredFields.filter(
      (field) => !studentDetails[field],
    );

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    const { dateOfBirth, ...details } = studentDetails;

    // Append all form fields
    Object.entries(details).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // Format date and append
    formData.append("dateOfBirth", format(dateOfBirth, "yyyy-MM-dd"));

    try {
      await createStudent(formData).unwrap();
    } catch (err) {
      console.error("Failed to create student:", err);
      toast.error(
        err?.data?.message || "Failed to create student. Please try again.",
      );
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div className="bg-white min-h-screen px-4 sm:px-10 py-6 flex flex-col gap-6">
        {/* Profile Picture Upload */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <label htmlFor="profile-upload">
              <img
                src={
                  studentDetails.picture
                    ? URL.createObjectURL(studentDetails.picture)
                    : "default-avatar.png"
                }
                alt="profile"
                className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] rounded-full cursor-pointer"
              />
            </label>
            <input
              id="profile-upload"
              type="file"
              name="picture"
              onChange={handleChange}
              className="hidden"
              accept="image/*"
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-sm sm:text-[16px]">Profile Picture</h2>
              <p className="text-gray-500 text-sm">PNG, JPEG, etc.</p>
            </div>
          </div>
        </div>

        {/* Student Information Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <h2 className="text-[18px]">Add Student Information</h2>

          <div className="w-full border border-gray-200 p-4 flex flex-col gap-4">
            {/* Personal Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["firstName", "middleName", "otherNames"].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label htmlFor={field} className="text-sm capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={studentDetails[field]}
                    onChange={handleChange}
                    className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Academic Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="age" className="text-sm">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={studentDetails.age}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="classId" className="text-sm">
                  Class
                </label>
                <select
                  name="classId"
                  value={studentDetails.classId}
                  onChange={handleChange}
                  className="text-sm text-gray-600 px-4 py-2 outline-none border border-gray-300 rounded-lg"
                  disabled={isClassLoading}
                >
                  <option value="">Select Class</option>
                  {classes?.map((cls) => (
                    <option value={cls.id} key={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="parentsNumber" className="text-sm">
                  Parents Number
                </label>
                <input
                  type="tel"
                  id="parentsNumber"
                  name="parentsNumber"
                  value={studentDetails.parentsNumber}
                  onChange={handleChange}
                  placeholder="+234"
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="dateOfBirth" className="text-sm">
                  Date of Birth
                </label>
                <DatePicker
                  selected={studentDetails.dateOfBirth}
                  onChange={(date) =>
                    setStudentDetails((prev) => ({
                      ...prev,
                      dateOfBirth: date,
                    }))
                  }
                  dateFormat="MM/dd/yyyy"
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="gender" className="text-sm">
                  Gender
                </label>
                <select
                  name="gender"
                  value={studentDetails.gender}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="stateOfOrigin" className="text-sm">
                  State of Origin
                </label>
                <select
                  name="stateOfOrigin"
                  value={studentDetails.stateOfOrigin}
                  onChange={handleStateChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesWithLgas).map((state) => (
                    <option value={state} key={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lgaOfOrigin" className="text-sm">
                  Local Government
                </label>
                <select
                  name="lgaOfOrigin"
                  value={studentDetails.lgaOfOrigin}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                  disabled={!lgas.length}
                >
                  <option value="">Select LGA</option>
                  {lgas.map((lga) => (
                    <option value={lga} key={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="parentsAddress" className="text-sm">
                  Parents Address
                </label>
                <input
                  type="text"
                  id="parentsAddress"
                  name="parentsAddress"
                  value={studentDetails.parentsAddress}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm">
                  Default Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={studentDetails.password}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="flex gap-6 justify-between items-center mt-6">
            {["birthCertificate", "medicalReport"].map((field) => (
              <div
                key={field}
                className="w-[400px] border border-gray-300 p-6 rounded-lg flex flex-col items-center gap-2"
              >
                <label htmlFor={field} className="cursor-pointer">
                  <AiOutlineCloudUpload size={30} />
                  <p className="text-sm mt-2">
                    Upload {field.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </label>
                <input
                  id={field}
                  type="file"
                  name={field}
                  onChange={handleChange}
                  className="hidden"
                />
                {studentDetails[field] && (
                  <span className="text-xs text-gray-500">
                    {studentDetails[field].name}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="mt-4 bg-[#4a3aff] hover:bg-[#5144e3]"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Add Student"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AddStudent;
