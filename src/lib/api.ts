const API_BASE_URL = 'https://functions.poehali.dev/0c0892bd-914f-49c2-a6e9-5ee5338063de';

export async function fetchArbitrageOpportunities() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch arbitrage opportunities');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching arbitrage opportunities:', error);
    return [];
  }
}
