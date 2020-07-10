const enum Levels {
  CRITICAL = 50,
  ERROR = 40,
  WARNING = 30,
  INFO = 20,
  DEBUG = 10,
  NOTSET = 0
}

export default class Logger {
  description: string
  sheet_id: string
  sheet_page_name: string
  logfmt: string
  datefmt: string
  level_label: string
  level: number
  user: string
  Levels: Levels
  use_sheet: boolean
  use_console: boolean
  sheet_log_slice: boolean

  constructor() {
    this.description =
      '這是一個Logger，用法請看https://github.com/we684123/Google_Apps_Script_Logger'
    this.sheet_id = ''
    this.sheet_page_name = "Log"
    this.logfmt =
      '%{datefmt} - %{user} - %{levelname} : %{message}'
    // 暫時只有這四個
    this.datefmt = "yyyy.MM.dd HH:mm:ss z"
    // 格式設定看這裡
    // https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
    this.level_label = 'WARNING'
    this.level = this.get_level_number(this.level_label)
    this.user = Session.getActiveUser().getEmail();
    this.use_sheet = false
    this.use_console = true
    this.sheet_log_slice = true
  }

  public get_config(): string {
    return `
    sheet_id = ${this.sheet_id}
    sheet_page_name = ${this.sheet_page_name}
    logfmt = ${this.logfmt}
    datefmt = ${this.datefmt}
    level = ${this.level}
    level_label = ${this.level_label}
    use_sheet = ${this.use_sheet}
    use_console = ${this.use_console}
    sheet_log_slice = ${this.sheet_log_slice}
    `
  }

  public set_config(
    sheet_id: string,
    sheet_page_name: string = "Log",
    logfmt: string =
      '%{datefmt} %{user} %{levelname} : %{message}',
    datefmt: string = "yyyy.MM.dd G 'at' HH:mm:ss z",
    level: number = 30
  ): void {
    this.sheet_id = sheet_id
    this.sheet_page_name = sheet_page_name
    this.logfmt = logfmt
    this.datefmt = datefmt
    this.level = level
    this.level_label = 'WARNING'
    this.level = this.get_level_number(this.level_label)
    this.use_sheet = false
    this.use_console = true
    this.sheet_log_slice = true
  }

  public set_sheet_id(sheet_id: string): void {
    this.sheet_id = sheet_id
  }

  public set_sheet_page_name(sheet_page_name: string): void {
    this.sheet_page_name = sheet_page_name
  }

  public set_logfmt(logfmt: string): void {
    this.logfmt = logfmt
  }

  public set_datefmt(datefmt: string): void {
    this.datefmt = datefmt
  }

  public set_level(level: string): void {
    this.level = this.get_level_number(level)
  }

  public set_use_sheet(boolean: boolean) {
    this.use_sheet = boolean
  }

  public set_use_console(boolean: boolean) {
    this.use_console = boolean
  }

  public set_sheet_log_slice(boolean: boolean) {
    this.sheet_log_slice = boolean
  }

  public log(level_label: Levels, text: string) {
    const handle_level = (level_label: Levels, text: string): void => {
      switch (level_label) {
        case Levels.CRITICAL:
          // console.log(Levels.CRITICAL, this.level)
          if (Number(Levels.CRITICAL) >= Number(this.level)) {
            if (this.use_console) {
              console.error(this.ass_msg('CRITICAL', text));
            }
            if (this.use_sheet) {
              let wt: string[]
              if (this.sheet_log_slice) {
                wt = []
                let regexp = /%{([^\{\}]+)}/gi
                let matches_array = this.logfmt.match(regexp);
                for (let value of matches_array) {
                  if (value == "%{datefmt}") {
                    wt.push(this.get_fmtdate())
                  } else if (value == "%{user}") {
                    wt.push(this.user)
                  } else if (value == "%{levelname}") {
                    wt.push('CRITICAL')
                  } else if (value == "%{message}") {
                    wt.push(text)
                  }
                }
              } else {
                wt = [this.ass_msg('CRITICAL', text)]
              }
              this.log_by_sheet(this.sheet_id, this.sheet_page_name, wt)
            }

          }
          break;
        case Levels.ERROR:
          // console.log(Levels.ERROR, this.level)
          if (Number(Levels.ERROR) >= Number(this.level)) {
            console.error(this.ass_msg('ERROR', text));
          }
          break;
        case Levels.WARNING:
          // console.log(Levels.WARNING, this.level)
          if (Number(Levels.WARNING) >= Number(this.level)) {
            console.warn(this.ass_msg('WARNING', text));
          }
          break;
        case Levels.INFO:
          // console.log(Levels.INFO, this.level)
          if (Number(Levels.INFO) >= Number(this.level)) {
            console.info(this.ass_msg('INFO', text));
          }
          break;
        case Levels.DEBUG:
          // console.log(Levels.DEBUG, this.level)
          if (Number(Levels.DEBUG) >= Number(this.level)) {
            console.info(this.ass_msg('DEBUG', text));
          }
          break;
        case Levels.NOTSET:
          // console.log(Levels.NOTSET, this.level)
          if (Number(Levels.NOTSET) >= Number(this.level)) {
            console.info(this.ass_msg('NOTSET', text));
          }
          break;
        default:
          throw (new Error('No have status code!'));
      }
    }
    handle_level(level_label, text)
  }
  public critical(text: string) {
    if (Number(Levels.CRITICAL) >= Number(this.level)) {
      console.error(this.ass_msg('CRITICAL', text));
    }
  }
  public error(text: string) {
    if (Number(Levels.ERROR) >= Number(this.level)) {
      console.error(this.ass_msg('ERROR', text));
    }
  }
  public warning(text: string) {
    if (Number(Levels.WARNING) >= Number(this.level)) {
      console.warn(this.ass_msg('WARNING', text));
    }
  }
  public info(text: string) {
    if (Number(Levels.INFO) >= Number(this.level)) {
      console.info(this.ass_msg('INFO', text));
    }
  }
  public debug(text: string) {
    if (Number(Levels.DEBUG) >= Number(this.level)) {
      console.info(this.ass_msg('DEBUG', text));
    }
  }
  public notest(text: string) {
    if (Number(Levels.NOTSET) >= Number(this.level)) {
      console.info(this.ass_msg('NOTSET', text));
    }
  }

  private ass_msg(levelname: string, message: string) {
    let formattedDate = this.get_fmtdate()

    return this.logfmt
      .replace(/%{datefmt}/g, formattedDate)
      .replace(/%{user}/g, this.user)
      .replace(/%{levelname}/g, levelname)
      .replace(/%{message}/g, message)
  }

  private get_fmtdate() {
    return Utilities.formatDate(new Date(), "GMT", this.datefmt)
  }

  private get_level_number(level_label: string) {
    switch (level_label) {
      case 'CRITICAL':
        return 50
      case 'ERROR':
        return 40
      case 'WARNING':
        return 30
      case 'INFO':
        return 20
      case 'DEBUG':
        return 10
      case 'NOTSET':
        return 0
      default:
        throw (new Error('Is not allow level_label!'));
    }
  }

  private log_by_sheet(
    sheet_key: string,
    page: string = 'log',
    text_array: string[] = []
  ) {
    const SpreadSheet = SpreadsheetApp.openById(sheet_key);
    const sheet = SpreadSheet.getSheetByName(page);
    let SheetLastRow = sheet.getLastRow();
    let LastRow_next = Number(SheetLastRow) + 1
    let len_text_array = text_array.length

    sheet.getRange(LastRow_next, 1, len_text_array, 1).setValues([text_array]);
  }
}
