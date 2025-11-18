const buttons = document.querySelectorAll('.tab-button');
const pages = document.querySelectorAll('.subpage');
const searchBox = document.getElementById('searchBox');
const suggestions = document.getElementById('suggestions');
const loader = document.getElementById('loader');buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.target).classList.add('active');
  });
});searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim();
  if (!query) return;
  loader.style.display = 'block';
  suggestions.innerHTML = '';  try {
    const [gitRes, wikiRes] = await Promise.all([
      fetch(`https://api.github.com/search/repositories?q=${query}`),
      fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=5&format=json&origin=*`)
    ]);
    const gitData = await gitRes.json();
    const wikiData = await wikiRes.json();
    let html = '';    gitData.items.slice(0, 3).forEach(repo => {
      html += `<li><strong>GitHub:</strong> <a href="${repo.html_url}" target="_blank">${repo.full_name}</a></li>`;
    });
    wikiData[1].forEach((title, i) => {
      html += `<li><strong>Wikipedia:</strong> <a href="${wikiData[3][i]}" target="_blank">${title}</a></li>`;
    });    suggestions.innerHTML = html;
  } catch (err) {
    console.error('Search error:', err);
  } finally {
    loader.style.display = 'none';
  }
});
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});// Optional: Close sidebar when link is clicked (on mobile)
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  });
});
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);
  const msg = form.get("msg");
  const role = form.getAll("role[]");

  const response = await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msg, role })
  });

  const result = await response.json();
  if (result.status === "success") {
    alert("Feedback sent successfully!");
  } else {
    alert("Something went wrong. Try again.");
  }
});
