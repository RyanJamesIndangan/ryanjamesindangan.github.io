/**
 * Component Loader Module
 * Dynamically loads HTML components into the page
 * Enterprise-grade modular architecture
 */

export class ComponentLoader {
    constructor() {
        this.components = [];
        this.loadedComponents = new Set();
    }

    /**
     * Register a component to be loaded
     * @param {string} id - Target element ID
     * @param {string} path - Path to component HTML file
     * @param {number} order - Loading order
     */
    register(id, path, order = 0) {
        this.components.push({ id, path, order });
    }

    /**
     * Load a single component
     * @param {Object} component - Component configuration
     */
    async loadComponent({ id, path }) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${path}`);
            }
            
            const html = await response.text();
            const targetElement = document.getElementById(id);
            
            if (targetElement) {
                targetElement.innerHTML = html;
                this.loadedComponents.add(id);
                this.dispatchComponentLoaded(id);
            } else {
                console.warn(`Target element not found: ${id}`);
            }
        } catch (error) {
            console.error(`Error loading component ${id}:`, error);
        }
    }

    /**
     * Load all registered components
     */
    async loadAll() {
        // Sort components by order
        const sortedComponents = [...this.components].sort((a, b) => a.order - b.order);
        
        // Load components in parallel batches
        const loadPromises = sortedComponents.map(component => 
            this.loadComponent(component)
        );
        
        try {
            await Promise.all(loadPromises);
            this.dispatchAllComponentsLoaded();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    /**
     * Dispatch custom event when a component is loaded
     * @param {string} componentId - ID of loaded component
     */
    dispatchComponentLoaded(componentId) {
        const event = new CustomEvent('componentLoaded', {
            detail: { componentId }
        });
        document.dispatchEvent(event);
    }

    /**
     * Dispatch custom event when all components are loaded
     */
    dispatchAllComponentsLoaded() {
        const event = new CustomEvent('allComponentsLoaded');
        document.dispatchEvent(event);
    }

    /**
     * Check if a component is loaded
     * @param {string} id - Component ID
     * @returns {boolean}
     */
    isLoaded(id) {
        return this.loadedComponents.has(id);
    }
}

// Create singleton instance
export const componentLoader = new ComponentLoader();

