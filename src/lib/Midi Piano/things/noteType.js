export class noteType {
  constructor(value) {
    switch (value) {
      // true, "true", "on" => "on"
      case true:
      case "true":
      case "on":
        this.value = "on";
        break;

      // false, "false", "off" => "off"
      case false:
      case "false":
      case "off":
        this.value = "off";
        break;

      // "forward", "fw" => "fw"
      case "forward":
      case "fw":
        this.value = "fw";
        break;

      // "backward", "bk" => "bk"
      case "backward":
      case "bk":
        this.value = "bk";
        break;

      // others => error
      default:
        this.showerror(value);
        break;
    }
  }

  // allowedValues = ["not allowed", "allowed", "go back", "go forward"]; resembling with following line:
  static allowedValues = ["off", "on", "bk", "fw"];

  allowed() {
    if (this.value != "off") {
      return true;
    } else return false;
  }

  cycle() {
    const currentIndex = noteType.allowedValues.indexOf(this.value);
    const nextIndex = (currentIndex + 1) % noteType.allowedValues.length;
    this.value = noteType.allowedValues[nextIndex];
  }

  help() {
    console.log(
      ` for adding new noteTypes, edit noteType class. (also methods and values, switch). currently allowed values are: ${noteType.allowedValues.join(
        ", "
      )}`
    );
  }

  showerror(errorReason = "") {
    throw new Error(
      `Invalid value for noteType: ${errorReason}. Allowed values are: ${noteType.allowedValues.join(
        ", "
      )}`
    );
  }
}
