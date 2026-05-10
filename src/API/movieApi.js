// React获取Flask响应数据
export async function getMovies() {
  const response = await fetch("http://127.0.0.1:5000/movies")

  if (!response.ok) {
    throw new Error("获取电影失败")
  }

  return await response.json()
}

