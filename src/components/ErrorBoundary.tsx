import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Une erreur inattendue est survenue.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090F] text-[#F4F4F8] flex items-center justify-center px-6">
          <div className="max-w-lg w-full bg-[#12111C] border border-white/10 rounded-xl p-8 space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Interruption temporaire
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Une erreur applicative s’est produite lors du chargement de cette section. Vous
              pouvez réinitialiser l’affichage sans perdre vos données.
            </p>
            <div className="text-xs font-mono text-zinc-500 bg-black/40 border border-white/5 rounded-lg p-3 break-words">
              {this.state.message}
            </div>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.hash = '';
              }}
              className="px-4 py-2.5 text-sm font-medium bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-lg transition-colors"
            >
              Revenir à l’accueil JITALX
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
