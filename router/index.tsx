/**
 * 路由渲染器
 * 根据当前路由 ID 渲染对应组件
 */
import React from 'react';
import { routes, getRouteById, canAccessRoute, Route } from './routes';
import { RouteId } from '../constants/routes';
import { ProtectedView } from '../components/auth/ProtectedView';

interface RouterProps {
    currentView: RouteId;
    onBack: () => void;
}

/**
 * 路由渲染组件
 * 根据配置自动渲染组件和权限包装
 */
export const RouterView: React.FC<RouterProps> = ({ currentView, onBack }) => {
    const route = getRouteById(currentView);

    if (!route) {
        return <div>404 - 页面不存在</div>;
    }

    const Component = route.component;
    const props = route.props || {};

    // 如果路由需要权限控制
    if (route.allowedRoles && route.allowedRoles.length > 0) {
        return (
            <ProtectedView allowedRoles={route.allowedRoles} onBack={onBack}>
                <Component {...props} />
            </ProtectedView>
        );
    }

    // 无权限限制，直接渲染
    return <Component {...props} />;
};

export { routes, getRouteById, canAccessRoute };
export type { Route };
