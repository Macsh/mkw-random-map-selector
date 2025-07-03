import { useLanguage } from '../../contexts/useLanguage.js';

function ResultsTest({ sessionData, onNewSession }) {
  const { language, t } = useLanguage();

  console.log('ResultsTest rendering with sessionData:', sessionData);
  console.log('Language:', language);
  console.log('Translation function:', t);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Results Test Component</h1>
      <p>Language: {language}</p>
      <p>Session data exists: {sessionData ? 'Yes' : 'No'}</p>
      {sessionData && (
        <div>
          <p>Races count: {sessionData.races?.length || 'Unknown'}</p>
          <p>Players count: {sessionData.players?.length || 'Unknown'}</p>
          {sessionData.races && sessionData.races.length > 0 && (
            <div>
              <h3>Races:</h3>
              {sessionData.races.map((race, index) => (
                <div key={race.id || index}>
                  Race {index + 1}: {race.nameEn || 'Unknown'} / {race.nameFr || 'Unknown'}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={onNewSession}>New Session (Test)</button>
    </div>
  );
}

export default ResultsTest;
