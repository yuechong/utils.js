;
(function(nameSpace) {

  nameSpace.zyc_utils = {

    isDate: isDate,
    isRegExp: isRegExp,
    isWindow: isWindow,
    isFunction: isFunction,
    isDefined: isDefined,
    isObject: isObject,
    isString: isString,
    isNumber: isNumber,
    isEmptyObject: isEmptyObject,
    trim: trim,
    makeMap: makeMap,
    includes: includes,
    arrayRemove: arrayRemove,
    // 总和计算
    sum: sum,
    store: store,
    sessionStore: sessionStore,
    copy: extend,
    parseURL: parseURL


  };


  function isDate(value) {
    return Object.prototype.toString.call(value) === '[object Date]';
  }

  function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
  }

  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function isObject(value) {
    // http://jsperf.com/isobject4
    return value !== null && typeof value === 'object';
  }

  function isString(value) { return typeof value === 'string'; }

  function isNumber(value) { return typeof value === 'number'; }

  function isArray(obj) { return Array.isArray(obj); }


  function trim(value) {
    return text == null ?
      "" :
      (text + "").replace(rtrim, "");
  }

  function isPlainObject(obj) {
    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }

    proto = Object.getPrototypeOf(obj);

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
      return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
  }

  function isEmptyObject(obj) {

    var name;

    for (name in obj) {
      return false;
    }
    return true;
  }

  /**
   * @param str 'key1,key2,...'
   * @returns {object} in the form of {key1:true, key2:true, ...}
   */
  function makeMap(str) {
    var obj = {},
      items = str.split(','),
      i;
    for (i = 0; i < items.length; i++) {
      obj[items[i]] = true;
    }
    return obj;
  }

  function includes(array, obj) {
    return Array.prototype.indexOf.call(array, obj) != -1;
  }

  // 数组中删除value
  function arrayRemove(array, value) {
    var index = array.indexOf(value);
    if (index >= 0) {
      array.splice(index, 1);
    }
    return index;
  }

  // 总和计算
  function sum(obj, data) {

    var item;
    for (var i in data) {

      item = data[i];

      for (var key in obj) {

        obj[key] += item[key];
      }
    }

    return obj;
  }
  // 本地保存
  function store() {

    return {

      set: function(key, value) {

        // 不是字符串
        if (!isString(value)) {

          try {

            value = JSON.stringify(value);


          } catch (oException) {

            console.log(oException);

          }
        }

        // 存储
        try {

          window.localStorage.setItem(key, value);

        } catch (oException) {
          if (oException.name == 'QuotaExceededError') {
            console.log('超出本地存储限额！');
            //如果历史信息不重要了，可清空后再设置
            window.localStorage.clear();
            window.localStorage.setItem(key, value);
          }
        }

      },
      get: function(key) {

        var value = window.localStorage.getItem(key);

        // 不是字符串
        if (value !== null) {

          try {

            value = JSON.parse(value);


          } catch (oException) {

            console.log(oException);

          }
        }


        return value;

      },
      has: function(key) {

        var bool = false;

        if (window.localStorage.getItem(key) === null) {
          bool = false;
        } else {
          bool = true;
        }

        return bool;

      },
      delete: function(key) {
        if (window.localStorage.getItem(key) !== null) {
          window.localStorage.delete(key);
        }
      }
    };
  }



  // 临时保存
  function sessionStore() {
    return {

      set: function(key, value) {

        if (isString(value)) {

          try {
            value = JSON.stringify(value);

          } catch (oException) {
            console.log(oException);
          }

        }


        // 存储
        try {
          window.sessionStorage.setItem(key, value);
        } catch (oException) {
          if (oException.name == 'QuotaExceededError') {
            console.log('超出本地存储限额！');
            //如果历史信息不重要了，可清空后再设置
            window.sessionStorage.clear();
            window.sessionStorage.setItem(key, value);
          }
        }

      },
      get: function(key) {

        var value = window.sessionStorage.getItem(key);

        {

        }

        if (value !== null) {

          try {
            value = JSON.parse(value);
          } catch (oException) {
            console.log(value);
            console.log(oException.name);

          }

        }

        return value;

      },
      has: function(key) {

        var bool = false;

        if (window.sessionStorage.getItem(key) === null) {
          bool = false;
        } else {
          bool = true;
        }

        return bool;

      },
      delete: function(key) {
        if (window.sessionStorage.getItem(key) !== null) {
          window.sessionStorage.delete(key);
        }
      }
    };
  }


  function extend() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
      deep = target;

      // Skip the boolean and the target
      target = arguments[i] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {

      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {

        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (isPlainObject(copy) ||
              (copyIsArray = Array.isArray(copy)))) {

            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];

            } else {
              clone = src && isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  }

  function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function() {
        var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s;
        for (; i < len; i++) {
          if (!seg[i]) { continue; }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    };
  }

  function equals(o1, o2) {

    if (o1 === o2) {
      return true;
    }

    if (o1 === null || o2 === null) {
      return false;
    }

    if (o1 !== o1 && o2 !== o2) {
      return true; // NaN === NaN
    }

    const t1 = typeof o1;

    const t2 = typeof o2;

    let length;
    let key;
    let keySet;

    if (t1 === t2 && t1 === 'object') {
      if (Array.isArray(o1)) {
        if (!Array.isArray(o2)) {
          return false;
        }
        if ((length = o1.length) === o2.length) {
          for (key = 0; key < length; key++) {
            if (!equals(o1[key], o2[key])) {
              return false;
            }
          }
          return true;
        }
      } else if (isDate(o1)) {
        if (!isDate(o2)) {
          return false;
        }
        return equals(o1.getTime(), o2.getTime());

      } else if (isRegExp(o1)) {
        if (!isRegExp(o2)) {
          return false;
        }
        return o1.toString() === o2.toString();
      } else {
        if (isWindow(o1) || isWindow(o2) || Array.isArray(o2) || isDate(o2) || isRegExp(o2)) {
          return false;
        }

        keySet = Object.create(null);

        for (key in o1) {
          if (key.charAt(0) === '$' || isFunction(o1[key])) {
            continue
          }
          if (!equals(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
        for (key in o2) {
          if (!(key in keySet) &&
            key.charAt(0) !== '$' &&
            isDefined(o2[key]) &&
            !isFunction(o2[key])
          ) {
            return false;
          }
        }


        return true;
      }
    }
    return false;
  }

})(window);
