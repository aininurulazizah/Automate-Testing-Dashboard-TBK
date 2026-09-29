export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed',
    });
  }

  try {
    const {
      testFile,
      keyword,
      executionDate,
    } = req.body;

    if (!testFile || !keyword || !executionDate) {
      return res.status(400).json({
        message: 'testFile, keyword, dan executionDate wajib diisi.',
      });
    }

    const response = await fetch(
      'https://api.github.com/repos/aininurulazizah/Automate-Testing-WL-TBK/actions/workflows/run-playwright.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2026-03-10',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            test_file: testFile,
            keyword,
            rerun: 'true',
            execution_date: executionDate,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();

      console.error('GitHub API error:', error);

      return res.status(response.status).json({
        message: 'Gagal menjalankan GitHub Actions.',
        error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Rerun berhasil dikirim ke GitHub Actions.',
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
}
