export async function uploadImage(id, formData, endpoint) {
   // 3️⃣ Enviar a imagem (se houver)
    let imageResponse = null;
    if (formData.image) {
      const file = formData.image;
      const fileMultipart = new FormData();
      fileMultipart.append("file", file);
      const res = await fetch(`${endpoint}/image/upload/${id}`, {
        method: "POST",
        credentials: "include",
        body: fileMultipart,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro ao enviar imagem", res.status, text);
        throw new Error(`Erro ao enviar imagem: ${res.status}`);
      }

      imageResponse = await res;
    }

    return imageResponse;
}

export async function getData(page, size, endpoint) {
  const url = `${endpoint}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Erro status:", res.status, text);
    throw new Error(`Erro ao dados: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getDataById(id, endpoint) {
  const res = await fetch(`${endpoint}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("getDataById: erro status", res.status, text);
    throw new Error(`Erro ao buscar com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function createData(teamData, endpoint) {
  let options = {
    method: "POST",
    credentials: "include",
  };
  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(teamData);
  }
  const res = await fetch(endpoint, options);
  if (!res.ok) {
    const text = await res.text();
    console.error("create: erro status 01", res.status, text);
    throw new Error(`Erro ao criar dados: ${res.status}`);
  }

  const location = res.headers.get("location");
  const id = location.split("/").pop();

  const res2 = await uploadImage(id, teamData, endpoint);

  return res, res2;
}

export async function updateData(id, teamData, endpoint) {
  let options = {
    method: "PUT",
    credentials: "include",
  };
  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(teamData);
  }
  const res = await fetch(`${endpoint}/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error("update: erro status", res.status, text);
    throw new Error(`Erro ao atualizar dados com id ${id}: ${res.status}`);
  }
  
  const res2 = await uploadImage(id, teamData, endpoint);

  return res, res2;
}

export async function deleteData(id, endpoint) {
  const res = await fetch(`${endpoint}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("delete: erro status", res.status, text);
    throw new Error(`Erro ao deletar dados com id ${id}: ${res.status}`);
  }
  return true;
}