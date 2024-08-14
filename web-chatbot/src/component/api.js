const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';
console.log()
export const fetchData = async (word) => {
  const url = `${apiUrl}/${encodeURIComponent(word)}`;
  console.log()
  try {
    const res = await fetch(url);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error("Üzgünüm, verileri alırken bir hata oluştu.");
  }
};
