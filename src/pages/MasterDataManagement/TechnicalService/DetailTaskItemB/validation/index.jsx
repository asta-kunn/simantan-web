import { toast } from "sonner";

const validateRegistrationType = ({
  title, dataVersion
}) => {

  if(title.segment === 'B') return true;

  if (!title.registration_type) {
    toast.error("Registration Type tidak boleh kosong", {
      duration: 2000,
      style: {
        background: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba"
      }
    });
    return false;
  }

  if (title.registration_type === "Variation" && !title.registration_number) {
    toast.error("NIE Number tidak boleh kosong ketika Registration Type adalah variation", {
      duration: 2000,
      style: {
        background: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba"
      }
    });
    return false;
  }

  const maNumberVersion = dataVersion.find(item => item.id === 4);
  if (title.registration_type === "Variation" && (!maNumberVersion || !maNumberVersion.value || maNumberVersion.value.trim() === "")) {
    toast.error("MA Number tidak boleh kosong ketika Registration Type adalah variation", {
      duration: 2000,
      style: {
        background: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba"
      }
    });
    return false;
  }

  return true;
};

const validateSegments = (data) => {
  for (const segment of data) {
    let hasCheckedItem = false;

    if(segment.title === "INTERMEDIATE MATERIALS") continue;
    else if(segment.children.length === 0) continue;

    // Periksa apakah ada minimal 1 item yang dicentang di segment ini
    for (const child of segment.children) {
      for (const subchild of child.subchild) {
        if (subchild.isChecked) {
          hasCheckedItem = true;
          break;
        }
      }
      if (hasCheckedItem) break;
    }

    // Jika tidak ada item yang dicentang di segment ini, tampilkan error
    if (!hasCheckedItem) {
        toast.error(`Segment ${segment.title} harus memiliki minimal 1 item yang dipilih`, {
        duration: 2000,
        style: {
          background: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffeeba"
        }
      });
      return false;
    }
  }

  return true;
};

const validateManufacturerSegments = (data) => {
  
  for (const segment of data) {
    let hasCheckedItem = false;

    // if(segment.title === "INTERMEDIATE MATERIALS") continue;

    for (const child of segment.children) {
      for (const subchild of child.subchild) {
        if (!subchild.id) {
          hasCheckedItem = true;
          break;
        }
      }
      if (hasCheckedItem) break;
    }

    
    console.log("MAKSUDMU DISINI?", segment.title)

    if (hasCheckedItem) {
     
      toast.error(`Segment ${segment.title}, terdapat formula yang tidak memiliki manufacturer`, {
        duration: 2000,
        style: {
          background: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffeeba"
        }
      });
      return false;
    }
  }

  return true;
};

const validateComment = (comment) => {
  if (!comment) {
    toast.error("Comment tidak boleh kosong", {
      duration: 2000,
      style: {
        background: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba"
      }
    });
    return false;
  }
  return true;
};

export {
  validateComment,
  validateManufacturerSegments,
  validateSegments,
  validateRegistrationType
}