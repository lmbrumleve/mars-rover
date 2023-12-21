class JestReports {
   constructor(globalConfig, reporterOptions, reporterContext) {
      this._globalConfig = globalConfig;
      this._options = reporterOptions;
      this._context = reporterContext;
   }
}

module.exports = JestReports;