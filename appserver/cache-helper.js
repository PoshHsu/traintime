
var cachedData = {};
var timeKeyPair = [];

// opt: 
// {
//   expireAt:  // the time this entry expires
//   live:      // diff from now to the time this entry expires
// }
// on of expireAt/life must be specified. If both are specified, this entry will be
// cleaned at the earlier time.
exports.addEntry = function(key, val, opt) {
  if (!opt) throw new Error("Not option");
  console.log(JSON.stringify(opt));
  if (!opt.expireAt && !opt.live) throw new Error("expireAt or live must be specified");

  var expireAt = -1;
  if (opt.live) expireAt = new Date() + opt.live;
  if (expireAt < 0 || (opt.expire > 0 && opt.expireAt < expireAt)) {
    expireAt = opt.expireAt;
  }
  timeKeyPair.push([expireAt, key]);
  cachedData[key] = {
    expireAt: expireAt,
    val: val
  };
};

exports.getEntry = function(key) {
  var val = cachedData[key];
  if (!val) return null;
  return val.val;
};

// Need to build a periodic cleaner.
