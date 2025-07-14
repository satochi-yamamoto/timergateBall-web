import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Oops! Algo deu errado
            </h2>
            <p className="text-gray-400 mb-6">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Recarregar Página
              </Button>
            </div>
            
            {isDevelopment && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="mt-2 p-3 bg-gray-900 rounded text-xs text-red-400 font-mono overflow-auto max-h-32">
                  <div>{this.state.error.toString()}</div>
                  {this.state.errorInfo.componentStack && (
                    <div className="mt-2 text-gray-500">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;