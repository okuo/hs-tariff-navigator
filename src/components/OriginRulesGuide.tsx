import React, { useState, useEffect } from 'react';
import type { OriginRule, OriginRulesData } from '@/types';

interface OriginRulesGuideProps {
  agreementId?: string;
  agreementName?: string;
}

const OriginRulesGuide: React.FC<OriginRulesGuideProps> = ({ agreementId, agreementName }) => {
  const [rulesData, setRulesData] = useState<OriginRulesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('certification');

  useEffect(() => {
    loadOriginRules();
  }, []);

  const loadOriginRules = async () => {
    try {
      const response = await fetch(chrome.runtime.getURL('data/origin_rules.json'));
      const data = await response.json();
      setRulesData(data);
    } catch (error) {
      console.error('Failed to load origin rules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!rulesData) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        原産地規則データを読み込めませんでした
      </div>
    );
  }

  const rules = agreementId && rulesData.data[agreementId]
    ? rulesData.data[agreementId]
    : rulesData.data['default'];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          原産地規則ガイド
        </h3>
        {agreementName && (
          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded">
            {agreementName}
          </span>
        )}
      </div>

      {/* 原産地証明の種類 */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('certification')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-expanded={expandedSection === 'certification'}
          aria-label="原産地証明の種類を展開"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">原産地証明の種類</span>
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedSection === 'certification' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSection === 'certification' && (
          <div className="p-3 space-y-2 dark:bg-gray-800">
            {rules.certification_types.map((cert, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{cert.name_ja}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{cert.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 必要書類 */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('documents')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-expanded={expandedSection === 'documents'}
          aria-label="必要書類を展開"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">必要書類</span>
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedSection === 'documents' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSection === 'documents' && (
          <div className="p-3 dark:bg-gray-800">
            <ul className="space-y-1">
              {rules.required_documents.map((doc, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 主な原産地規則 */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('rules')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-expanded={expandedSection === 'rules'}
          aria-label="主な原産地規則を展開"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">主な原産地規則</span>
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedSection === 'rules' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSection === 'rules' && (
          <div className="p-3 dark:bg-gray-800">
            <ul className="space-y-2">
              {rules.key_rules.map((rule, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-primary-300 dark:border-primary-600">
                  {rule}
                </li>
              ))}
            </ul>
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-300">
              <span className="font-medium">付加価値基準: </span>
              {rules.value_content_threshold}
            </div>
          </div>
        )}
      </div>

      {/* 備考 */}
      {rules.notes && (
        <div className="bg-warning-50 dark:bg-yellow-900/30 border border-warning-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-start">
            <svg className="w-4 h-4 text-warning-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-warning-800 dark:text-yellow-300">{rules.notes}</p>
          </div>
        </div>
      )}

      {/* 参照リンク */}
      <a
        href={rules.reference_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-primary-500"
        aria-label="税関の原産地規則ページを見る（外部リンク）"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        税関の原産地規則ページを見る
      </a>
    </div>
  );
};

export default OriginRulesGuide;
