const profileEditValidation = (req, res, next) => {
  const editInfo = req.body;

  const allowedEditInfo = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ];

  const editInfoKeys = Object.keys(editInfo);

  const isEditInfoValid = editInfoKeys.every((key) =>
    allowedEditInfo.includes(key)
  );

  if (!isEditInfoValid) {
    return res.status(400).json({ message: "Invalid edit info" });
  }

  const sanitizedEditInfo = {};

  if (editInfo.firstName !== undefined) {
    sanitizedEditInfo.firstName = editInfo.firstName.trim();
  }
  if (editInfo.lastName !== undefined) {
    sanitizedEditInfo.lastName = editInfo.lastName.trim();
  }
  if (editInfo.photoUrl !== undefined) {
    sanitizedEditInfo.photoUrl = editInfo.photoUrl.trim();
  }
  if (editInfo.about !== undefined) {
    sanitizedEditInfo.about = editInfo.about.trim();
  }
  if (editInfo.skills !== undefined) {
    sanitizedEditInfo.skills = editInfo.skills.trim();
  }

  if (editInfo.age !== undefined) {
    sanitizedEditInfo.age = editInfo.age;
  }
  if (editInfo.gender !== undefined) {
    sanitizedEditInfo.gender = editInfo.gender;
  }

  req.body = sanitizedEditInfo;
  next();
};

module.exports = { profileEditValidation };
