// Função para upload de múltiplas mídias (image, gif, video)
export async function uploadGameMediaFiles(id, formData, endpoint) {
  const mediaUploads = [];

  // Upload image
  if (formData.image) {
    try {
      const response = await uploadSingleMedia(id, formData.image, 'image', endpoint);
      mediaUploads.push({ type: 'image', response });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      mediaUploads.push({ type: 'image', error: error.message });
    }
  }

  // Upload gif
  if (formData.gif) {
    try {
      const response = await uploadSingleMedia(id, formData.gif, 'gif', endpoint);
      mediaUploads.push({ type: 'gif', response });
    } catch (error) {
      console.error('Erro ao enviar GIF:', error);
      mediaUploads.push({ type: 'gif', error: error.message });
    }
  }

  // Upload video
  if (formData.video) {
    try {
      const response = await uploadSingleMedia(id, formData.video, 'video', endpoint);
      mediaUploads.push({ type: 'video', response });
    } catch (error) {
      console.error('Erro ao enviar vídeo:', error);
      mediaUploads.push({ type: 'video', error: error.message });
    }
  }

  return mediaUploads;
}

// Função auxiliar para upload de mídia individual
async function uploadSingleMedia(id, file, type, endpoint) {
  const mediaFormData = new FormData();
  mediaFormData.append('file', file);
  mediaFormData.append('type', type);

  const res = await fetch(`${endpoint}/${id}/media`, {
    method: 'POST',
    credentials: 'include',
    body: mediaFormData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Erro ao enviar ${type}:`, res.status, text);
    throw new Error(`Erro ao enviar ${type}: ${res.status}`);
  }

  return await res.json();
}

// Função legada para compatibilidade
export async function uploadImage(id, formData, endpoint) {
  // Enviar a imagem (se houver)
  let imageResponse = null;
  if (formData.image) {
    const file = formData.image;
    const fileMultipart = new FormData();
    fileMultipart.append('file', file);
    const res = await fetch(`${endpoint}/image/upload/${id}`, {
      method: 'POST',
      credentials: 'include',
      body: fileMultipart,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Erro ao enviar imagem', res.status, text);
      throw new Error(`Erro ao enviar imagem: ${res.status}`);
    }

    imageResponse = await res;
  }
  return imageResponse;
}

export async function getDataWithToken(page, size, endpoint, token) {
  console.log('token', token);
  const url = `${endpoint}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('Erro status:', res.status, text);
    throw new Error(`Erro ao buscar dados: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getData(page, size, endpoint) {
  const url = `${endpoint}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('Erro status:', res.status, text);
    throw new Error(`Erro ao buscar dados: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getDataById(id, endpoint) {
  const res = await fetch(`${endpoint}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getDataById: erro status', res.status, text);
    throw new Error(`Erro ao buscar com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function createDataWithMedia(teamData, endpoint) {
  let options = {
    method: 'POST',
    credentials: 'include',
  };

  if (typeof teamData.tags === 'string' && teamData.tags.trim()) {
    teamData.tags = teamData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  } else if (!teamData.tags) {
    teamData.tags = [];
  }

  if (teamData.age_rating !== undefined) {
    teamData.ageRating = parseInt(teamData.age_rating) || 0;
    delete teamData.age_rating;
  }

  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(teamData);
  }

  const res = await fetch(endpoint, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('create: erro status', res.status, text);
    throw new Error(`Erro ao criar dados: ${res.status}`);
  }

  const location = res.headers.get('location');
  const id = location.split('/').pop();

  const mediaUploads = await uploadGameMediaFiles(id, teamData, endpoint);

  return { response: res, mediaUploads };
}

export async function createData(teamData, endpoint) {
  let options = {
    method: 'POST',
    credentials: 'include',
  };
  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(teamData);
  }
  const res = await fetch(endpoint, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('create: erro status 01', res.status, text);
    throw new Error(`Erro ao criar dados: ${res.status}`);
  }

  const location = res.headers.get('location');
  const id = location.split('/').pop();

  const res2 = await uploadImage(id, teamData, endpoint);

  return res, res2;
}

export async function updateDataWithMedia(id, teamData, endpoint) {
  let options = {
    method: 'PUT',
    credentials: 'include',
  };

  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(teamData);
  }

  if (typeof teamData.tags === 'string' && teamData.tags.trim()) {
    teamData.tags = teamData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  } else if (!teamData.tags) {
    teamData.tags = [];
  }

  if (teamData.age_rating !== undefined) {
    teamData.ageRating = parseInt(teamData.age_rating) || 0;
    delete teamData.age_rating;
  }

  const res = await fetch(`${endpoint}/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('update: erro status', res.status, text);
    throw new Error(`Erro ao atualizar dados com id ${id}: ${res.status}`);
  }

  const mediaUploads = await uploadGameMediaFiles(id, teamData, endpoint);

  return { response: res, mediaUploads };
}

export async function updateData(id, teamData, endpoint) {
  let options = {
    method: 'PUT',
    credentials: 'include',
  };
  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(teamData);
  }
  const res = await fetch(`${endpoint}/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('update: erro status', res.status, text);
    throw new Error(`Erro ao atualizar dados com id ${id}: ${res.status}`);
  }

  const res2 = await uploadImage(id, teamData, endpoint);

  return res, res2;
}

export async function deleteData(id, endpoint) {
  const res = await fetch(`${endpoint}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('delete: erro status', res.status, text);
    throw new Error(`Erro ao deletar dados com id ${id}: ${res.status}`);
  }
  return true;
}
