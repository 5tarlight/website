function derToPem(der) {
  var forge = require("node-forge");
  var derKey = forge.util.decode64(der);
  var asnObj = forge.asn1.fromDer(derKey);
  var asn1Cert = forge.pki.certificateFromAsn1(asnObj);
  return forge.pki.certificateToPem(asn1Cert);
};
