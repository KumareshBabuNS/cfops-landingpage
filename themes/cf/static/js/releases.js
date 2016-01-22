var BUCKET_URL = 'https://pivotal-cfops.s3.amazonaws.com';

jQuery(function($) {
  setDownloadLinksToLatestVersion();
});

function setDownloadLinksToLatestVersion() {
  $.get(BUCKET_URL)
    .done(function(data) {
      var xml = $(data);
      var versions = getReleasedVersionsFromS3Data(xml);
      if (versions.length > 0) {
        versions.sort(semverCompare);
        var latestVersion = versions[versions.length - 1];
        $("#version").text("Latest Release v" + latestVersion);
        $(".fa-apple a").attr("href", downloadUrl(latestVersion, "osx"));
        $(".fa-linux a").attr("href", downloadUrl(latestVersion, "linux64"));
        $(".fa-windows a").attr("href", downloadUrl(latestVersion, "win64"));
      }
    })
    .fail(function(error) {
      console.error(error);
    });
}

// Gets all version numbers under the S3 /release/osx folder
function getReleasedVersionsFromS3Data(xml) {
  var files = $.map(xml.find('Contents'), function(item) {
    item = $(item);
    file = item.find('Key').text();
    reg = /release\/osx\/v(\d+\.\d+\.\d+)/i
    m = file.match(reg);
    if (m) {
      return m[1];
    }
  });
  return files;
}

function downloadUrl(latestVersion, platform) {
  var url = BUCKET_URL + "/release/" + platform + "/v" + latestVersion + "/cfops"
  if (platform === "win64") {
    url = url + ".exe";
  }
  console.info(url);
  return url;
}

function semverCompare(a, b) {
  var pa = a.split('.');
  var pb = b.split('.');
  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
};
