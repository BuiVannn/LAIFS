importScripts('https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.js');

const sanSang = (async () => {
  const py = await loadPyodide();
  await py.loadPackage('numpy');
  py.runPython(await (await fetch('/runner.py')).text());
  return py;
})();

onmessage = async (e) => {
  try {
    const py = await sanSang;
    const kq = py.globals.get('chay')(e.data.code, e.data.tests);
    postMessage({ ok: true, ...JSON.parse(kq) });
  } catch (err) {
    postMessage({ ok: false, loi: String(err) });
  }
};
postMessage({ dangTai: true });
sanSang.then(() => postMessage({ sanSang: true }), (err) => postMessage({ ok: false, loi: String(err) }));
