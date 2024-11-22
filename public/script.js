async function consultarRastreamento() {
    const numero = document.getElementById('numero').value;
    const resultado = document.getElementById('resultado');
    
    if (!numero) {
        resultado.innerHTML = '<p>Por favor, insira um número de rastreamento.</p>';
        return;
    }
    
    try {
        const response = await fetch(`/api/rastreamento/${numero}`);
        const data = await response.json();
        
        if (response.ok) {
            resultado.innerHTML = `<p>Status: ${data.status}</p><p>Última localização: ${data.ultima_localizacao}</p>`;
        } else {
            resultado.innerHTML = `<p>Erro: ${data.message}</p>`;
        }
    } catch (error) {
        resultado.innerHTML = '<p>Erro ao consultar o rastreamento.</p>';
    }
}

